import {
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  CircularProgress,
  FormControl,
  OutlinedInput,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import logging from "../../utils/logging";
import { useStoreState } from "../../hooks";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FC, useEffect, useState } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { IMonitorAlerts } from "../../interfaces/IMonitorAlerts";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MonitorAlertService from "../../services/MonitorAlertsService";
import MonitorAlertsTable from "../../components/Table/MonitorAlertsTable";
import { Environment } from "../../enums/Enums";

interface IMonitorAlertsProps {}

const MonitorAlerts: FC<IMonitorAlertsProps> = () => {
  const [monitorAlerts, setMonitorAlerts] = useState<IMonitorAlerts[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedEnvironment, setSelectedEnvironment] = useState<number>(6);
  const [selectedDays, setSelectedDays] = useState<number>(7);
  const { isDarkMode } = useStoreState((state) => state.app);
  const [monitorId, setMonitorId] = useState<number>(0);
  const { t } = useTranslation("global");
  const { id } = useParams<{ id: string }>();
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    const fetchMonitorAlerts = async () => {
      try {
        if (id) {
          setMonitorId(parseInt(id));
        }
        const response = id
          ? await MonitorAlertService.get(parseInt(id), selectedDays)
          : await MonitorAlertService.get(monitorId, selectedDays);

        setMonitorAlerts(response);
        console.log(response);
        setIsLoading(false);
      } catch (error) {
        logging.error(error);
      }
    };
    fetchMonitorAlerts();
  }, [id, monitorId, selectedDays]);

  const handleEnvironmentChange = (event: SelectChangeEvent<number>) => {
    setSelectedEnvironment(event.target.value as number);
  };
  const handleDaysChange = (event: SelectChangeEvent<number>) => {
    setSelectedDays(event.target.value as number);
  };

  const handleExport = async () => {
    try {
      const response = await MonitorAlertService.getReportByEnviroment(
        monitorId,
        selectedDays,
        selectedEnvironment
      );
      const blob = response.data;

      if (blob.size === 0) {
        throw new Error("Received empty file.");
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", "AlertReport.xlsx"); // Adjust the filename as needed
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };
  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchText(event.target.value);
  };
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>AlertHawk | {t("users.text")}</title>
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
                <Box>
                  <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
                    <InputLabel id="environment-selection-label">
                      {t("dashboard.environment")}
                    </InputLabel>
                    <Select
                      labelId="environment-selection-label"
                      id="environment-selection"
                      value={selectedEnvironment}
                      label="Environment"
                      onChange={handleEnvironmentChange}
                    >
                      {(
                        Object.keys(Environment) as Array<
                          keyof typeof Environment
                        >
                      )
                        .filter((key) => !isNaN(Number(Environment[key])))
                        .map((key) => (
                          <MenuItem
                            key={Environment[key]}
                            value={Environment[key]}
                          >
                            {key}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box>
                  <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
                    <InputLabel id="days-selection-label">Period</InputLabel>
                    <Select
                      labelId="days-selection-label"
                      id="days-selection"
                      value={selectedDays}
                      label="Period"
                      onChange={handleDaysChange}
                    >
                      {[1, 7, 30, 60, 90, 120, 180].map((key) => (
                        <MenuItem key={key} value={key}>
                          {key === 1 ? `${key} day` : `${key} days`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <div style={{ width: "75%", minWidth: "200px" }}>
                  <FormControl fullWidth>
                    <OutlinedInput
                      size="small"
                      startAdornment={<SearchOutlinedIcon />}
                      value={searchText}
                      onChange={handleSearchInputChange}
                      placeholder={t("dashboard.search")}
                    />
                  </FormControl>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                      backgroundColor: isDarkMode ? "#8bc34a" : "#4caf50",
                      color: isDarkMode ? "#fff" : "#fefef7",
                      "&:hover": {
                        backgroundColor: isDarkMode ? "#8bd21a" : "#4cbf50",
                      },
                    }}
                    onClick={handleExport}
                  >
                    {t("monitorAlerts.export")}
                  </Button>
                </div>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {isLoading ? (
                  <CircularProgress color="success" />
                ) : (
                  <MonitorAlertsTable
                    monitorAlerts={monitorAlerts}
                    searchText={searchText}
                    selectedEnvironment={selectedEnvironment}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
export default MonitorAlerts;

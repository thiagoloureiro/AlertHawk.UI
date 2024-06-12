import { FC, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import CollapsibleTable from "../../components/Table/CollapsibleTable";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SelectedMonitorDetails from "./Items/SelectedMonitorDetails";
import { useStoreActions, useStoreState } from "../../hooks";
import {
  IMonitorGroupListByUser,
  IMonitorGroupListByUserItem,
} from "../../interfaces/IMonitorGroupListByUser";
import { Environment } from "../../enums/Enums";
import AddNewMonitor from "./Forms/AddNewMonitor";

interface IDashboardProps {}

const Dashboard: FC<IDashboardProps> = ({}) => {
  const { t } = useTranslation("global");
  const { isSidebarOpen, selectedEnvironment } = useStoreState(
    (state) => state.app
  );
  const { monitorGroupListByUser } = useStoreState((state) => state.monitor);
  const { setSelectedEnvironment } = useStoreActions((action) => action.app);
  const [addMonitorPanel, setAddMonitorPanel] = useState<boolean>(false);
  const [editMonitorPanel, setEditMonitorPanel] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [selectedChildRowIndex, setSelectedChildRowIndex] = useState<
    number | null
  >(null);
  const [selectedMetric, setSelectedMetric] = useState<
    | "uptime1Hr"
    | "uptime24Hrs"
    | "uptime7Days"
    | "uptime30Days"
    | "uptime3Months"
    | "uptime6Months"
  >("uptime24Hrs");

  const [monitorStatus, setMonitorStatus] = useState<string>("all");

  const handleMonitorStatusChange = (event: SelectChangeEvent<string>) => {
    setMonitorStatus(event.target.value);
  };

  useEffect(() => {
    setAddMonitorPanel(false);
    setEditMonitorPanel(false);
  }, []);
  const handleEnvironmentChange = (event: SelectChangeEvent<number>) => {
    setSelectedEnvironment(event.target.value as number);
  };

  const handleMetricChange = (event: SelectChangeEvent<string>) => {
    setSelectedMetric(
      event.target.value as
        | "uptime24Hrs"
        | "uptime7Days"
        | "uptime30Days"
        | "uptime3Months"
        | "uptime6Months"
    );
  };

  const [selectedMonitorGroup, setSelectedMonitorGroup] =
    useState<IMonitorGroupListByUser | null>(null);
  const [selectedMonitorItem, setSelectedMonitorItem] =
    useState<IMonitorGroupListByUserItem | null>(null);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchText(event.target.value);
  };

  const handleRowClick = (index: number) => {
    setSelectedRowIndex(selectedRowIndex === index ? selectedRowIndex : index);
    setSelectedChildRowIndex(null);
    setAddMonitorPanel(false);
    setEditMonitorPanel(false);
  };

  const handleChildRowClick = (index: number, monitorGroupId: number) => {
    setAddMonitorPanel(false);
    setEditMonitorPanel(false);
    setSelectedChildRowIndex(
      selectedChildRowIndex === index ? selectedChildRowIndex : index
    );
    setSelectedRowIndex(monitorGroupId);
  };

  useEffect(() => {
    setSelectedMonitorGroup(
      selectedRowIndex !== null
        ? monitorGroupListByUser.find((x) => x.id === selectedRowIndex) ?? null
        : null
    );
  }, [selectedRowIndex, monitorGroupListByUser]);

  useEffect(() => {
    setSelectedMonitorItem(
      selectedChildRowIndex !== null
        ? monitorGroupListByUser.reduce((foundItem, parent) => {
            if (foundItem) return foundItem;
            const childItem = parent.monitors.find(
              (child) => child.id === selectedChildRowIndex
            );
            return childItem ? childItem : foundItem;
          }, null as IMonitorGroupListByUserItem | null)
        : null
    );
  }, [selectedChildRowIndex, monitorGroupListByUser]);

  function handleAddNew(): void {
    setSelectedMonitorItem(null);
    setSelectedChildRowIndex(null);
    setSelectedMonitorGroup(null);
    setSelectedRowIndex(null);
    setEditMonitorPanel(false);
    setAddMonitorPanel(true);
  }

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>AlertHawk | {t("dashboard.text")}</title>
        </Helmet>
      </HelmetProvider>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={isSidebarOpen ? 6 : 5}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                gap={2}
                marginBottom={2}
              >
                <div style={{ flex: 1 }}>
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
                  <FormControl fullWidth>
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      sx={{
                        // mb: 2,
                        // mt: 2,
                        // ml: 2,
                        color: "white",
                        minWidth: "110px",
                        fontWeight: 700,
                        position: "relative",
                      }}
                      onClick={handleAddNew}
                    >
                      {t("dashboard.addNew")}
                    </Button>
                  </FormControl>
                </div>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                gap={2}
                marginBottom={4}
              >
                <Box sx={{ flex: 1 }}>
                  <FormControl sx={{ minWidth: 160 }} size="small" fullWidth>
                    <InputLabel id="metric-selection-label">
                      {t("dashboard.metric")}
                    </InputLabel>
                    <Select
                      labelId="metric-selection-label"
                      id="metric-selection"
                      value={selectedMetric}
                      label={t("dashboard.metric")}
                      onChange={handleMetricChange}
                    >
                      <MenuItem value="uptime1Hr">
                        1 {t("dashboard.hour")}
                      </MenuItem>
                      <MenuItem value="uptime24Hrs">
                        24 {t("dashboard.hours")}
                      </MenuItem>
                      <MenuItem value="uptime7Days">
                        7 {t("dashboard.days")}
                      </MenuItem>
                      <MenuItem value="uptime30Days">
                        30 {t("dashboard.days")}
                      </MenuItem>
                      <MenuItem value="uptime3Months">
                        3 {t("dashboard.months")}
                      </MenuItem>
                      <MenuItem value="uptime6Months">
                        6 {t("dashboard.months")}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <FormControl sx={{ minWidth: 160 }} size="small" fullWidth>
                    <InputLabel id="environment-selection-label">
                      {t("dashboard.environment")}
                    </InputLabel>
                    <Select
                      labelId="environment-selection-label"
                      id="environment-selection"
                      value={selectedEnvironment}
                      label={t("dashboard.environment")}
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
                <Box sx={{ flex: 1 }}>
                  <FormControl sx={{ minWidth: 160 }} size="small" fullWidth>
                    <InputLabel id="monitor-status-label">
                      {t("dashboard.status")}
                    </InputLabel>
                    <Select
                      labelId="monitor-status-label"
                      id="metric-selection"
                      value={monitorStatus}
                      label={t("dashboard.status")}
                      onChange={handleMonitorStatusChange}
                    >
                      <MenuItem value="all">{t("users.all")}</MenuItem>
                      <MenuItem value="up">{t("dashboard.up")}</MenuItem>
                      <MenuItem value="down">{t("dashboard.down")}</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Stack>
              <Box
                sx={{
                  overflowY: "auto",
                  maxHeight: "calc(100vh - 300px)",
                  paddingRight: "16px",
                  "&::-webkit-scrollbar": {
                    width: "0.4em",
                  },
                  "&::-webkit-scrollbar-track": {
                    boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                    webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "secondary.main",
                    outline: "1px solid secondary.main",
                    borderRadius: "30px",
                  },
                }}
              >
                <CollapsibleTable
                  monitors={monitorGroupListByUser}
                  searchText={searchText}
                  monitorStatus={monitorStatus}
                  handleRowClick={handleRowClick}
                  handleChildRowClick={handleChildRowClick}
                  selectedRowIndex={selectedRowIndex}
                  selectedChildRowIndex={selectedChildRowIndex}
                  selectedMetric={selectedMetric}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={isSidebarOpen ? 6 : 7}>
          {selectedMonitorGroup !== null || selectedMonitorItem !== null ? (
            //  const [editMonitorPanel, setEditMonitorPanel] = useState<boolean>(false);
            <SelectedMonitorDetails
              selectedMonitorGroup={selectedMonitorGroup}
              selectedMonitorItem={selectedMonitorItem}
              selectedMetric={selectedMetric}
              setEditMonitorPanel={setEditMonitorPanel}
              editMonitorPanel={editMonitorPanel}
            />
          ) : null}

          {addMonitorPanel && (
            <Card>
              <CardContent>
                <Box
                  sx={{
                    overflowY: "auto",
                    maxHeight: "calc(100vh - 210px)",
                    paddingRight: "16px",
                    "&::-webkit-scrollbar": {
                      width: "0.4em",
                    },
                    "&::-webkit-scrollbar-track": {
                      boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                      webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "secondary.main",
                      outline: "1px solid secondary.main",
                      borderRadius: "30px",
                    },
                  }}
                >
                  <AddNewMonitor setAddMonitorPanel={setAddMonitorPanel} />
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;

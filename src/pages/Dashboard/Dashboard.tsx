import { FC, useEffect, useState } from "react";
import {
  Box,
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

interface IDashboardProps {}

const Dashboard: FC<IDashboardProps> = ({}) => {
  const { t } = useTranslation("global");
  const { isSidebarOpen, selectedEnvironment } = useStoreState(
    (state) => state.app
  );
  const { monitorGroupListByUser } = useStoreState((state) => state.monitor);
  const { setSelectedEnvironment } = useStoreActions((action) => action.app);
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
  // const [selectedEnvironment, setSelectedEnvironment] = useState<number | "">(
  //   ""
  // );

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
  };

  const handleChildRowClick = (index: number) => {
    setSelectedChildRowIndex(
      selectedChildRowIndex === index ? selectedChildRowIndex : index
    );
    setSelectedRowIndex(null);
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
                marginBottom={4}
              >
                <Box>
                  <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
                    <InputLabel id="metric-selection-label">
                      {t("dashboard.metric")}
                    </InputLabel>
                    <Select
                      labelId="metric-selection-label"
                      id="metric-selection"
                      value={selectedMetric}
                      label="Metric"
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
                <div>
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
            <SelectedMonitorDetails
              selectedMonitorGroup={selectedMonitorGroup}
              selectedMonitorItem={selectedMonitorItem}
              selectedMetric={selectedMetric}
            />
          ) : null}
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
